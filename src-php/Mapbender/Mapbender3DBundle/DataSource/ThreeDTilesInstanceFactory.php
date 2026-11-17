<?php

namespace Mapbender\Mapbender3DBundle\DataSource;

use Doctrine\ORM\EntityManagerInterface;
use Mapbender\CoreBundle\Component\Source\SourceInstanceFactory;
use Mapbender\CoreBundle\Entity\Source;
use Mapbender\CoreBundle\Entity\SourceInstance;
use Mapbender\ManagerBundle\Component\Exchange\EntityPool;
use Mapbender\ManagerBundle\Component\Exchange\ImportState;
use Mapbender\ManagerBundle\Component\ImportHandler;
use Mapbender\ThreeDTilesBundle\Entity\ThreeDTilesInstance;
use Mapbender\ThreeDTilesBundle\Entity\ThreeDTilesInstanceLayer;
use Mapbender\ThreeDTilesBundle\Entity\ThreeDTilesLayerSource;
use Mapbender\ThreeDTilesBundle\Entity\ThreeDTilesSource;
use Mapbender\ThreeDTilesBundle\Entity\ThreeDTilesVariant;
use Mapbender\ThreeDTilesBundle\Form\Type\ThreeDTilesInstanceType;

class ThreeDTilesInstanceFactory extends SourceInstanceFactory
{
    public function __construct(
        protected EntityManagerInterface $entityManager,
    )
    {
    }

    public function createInstance(Source $source, ?array $options = null): SourceInstance
    {
        /** @var ThreeDTilesSource $source $instance */
        $instance = new ThreeDTilesInstance();
        $instance->setSource($source);

        $instance->setTitle($source->getTitle());
        $instance->setSelected(true);
        $instance->setAllowSelected(true);
        $instance->setWeight(0);
        return $instance;
    }

    public function fromConfig(array $data, string $id): SourceInstance
    {
        $source = $this->getSourceFromConfig($data, $id);
        $instance = new ThreeDTilesInstance();
        $instance->setId($id);
        $instance->setSource($source);
        $instance->setTitle($data['title'] ?? $source->getTitle());
        $instance->setOpacity($data['opacity'] ?? 100);
        $instance->setAllowSelected($data['allowSelected'] ?? true);
        $instance->setSelected($data['selected'] ?? true);
        $instance->setBasesource($data['basesource'] ?? $data['isBaseSource'] ?? false);

        return $instance;
    }

    protected function getSourceFromConfig(array $data, string $id): ThreeDTilesSource
    {
        $source = new ThreeDTilesSource();
        $source->setJsonUrl($data['jsonUrl'] ?? throw new \InvalidArgumentException("Missing 'jsonUrl' in vector tile source config"));
        $source->setTitle($data['title'] ?? $id);
        $source->setDescription($data['description'] ?? null);
        $source->setId($id);
        $source->setVariant(ThreeDTilesVariant::from($data['variant']));
        return $source;
    }

    public function matchInstanceToPersistedSource(ImportState $importState, array $data, EntityPool $entityPool): bool
    {
        $repository = $this->entityManager->getRepository(ThreeDTilesSource::class);
        $candidates = $repository->findBy(['jsonUrl' => $data['jsonUrl']]);
        if (count($candidates) === 0) {
            return false;
        }
        $source = $candidates[0];
        $classMeta = $this->entityManager->getClassMetadata(ThreeDTilesSource::class);
        $entityPool->add($source, ImportHandler::extractArrayFields($data, $classMeta->getIdentifier()));
        return true;
    }

    public function getFormTemplate(SourceInstance $instance): string
    {
        return '@Mapbender3D/DataSource/edit-instance.html.twig';
    }

    public function getFormType(SourceInstance $instance): string
    {
        return ThreeDTilesInstanceType::class;
    }
}
