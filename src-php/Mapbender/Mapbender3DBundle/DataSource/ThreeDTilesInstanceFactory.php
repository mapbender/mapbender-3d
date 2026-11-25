<?php

namespace Mapbender\Mapbender3DBundle\DataSource;

use Doctrine\ORM\EntityManagerInterface;
use Mapbender\CoreBundle\Component\Source\SourceInstanceFactory;
use Mapbender\CoreBundle\Entity\Source;
use Mapbender\CoreBundle\Entity\SourceInstance;
use Mapbender\ManagerBundle\Component\Exchange\EntityPool;
use Mapbender\ManagerBundle\Component\Exchange\ImportState;
use Mapbender\ManagerBundle\Component\ImportHandler;
use Mapbender\Mapbender3DBundle\DataSource\Type\ThreeDTilesInstanceType;
use Mapbender\Mapbender3DBundle\Entity\ThreeDTilesInstance;
use Mapbender\Mapbender3DBundle\Entity\ThreeDTilesSource;
use Mapbender\Mapbender3DBundle\Entity\ThreeDTilesVariant;

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
        $instance->setMappingProperty($data['mappingProperty'] ?? null);
        $instance->setPointSize($data['pointSize'] ?? null);

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
        if (isset($data['mappingProperty'])) $source->setMappingProperty($data['mappingProperty']);
        if (isset($data['buildingIdProperty'])) $source->setBuildingIdProperty($data['buildingIdProperty']);
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
