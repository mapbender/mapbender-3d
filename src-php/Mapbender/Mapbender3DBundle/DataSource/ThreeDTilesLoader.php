<?php

namespace Mapbender\Mapbender3DBundle\DataSource;

use Doctrine\ORM\EntityManagerInterface;
use Mapbender\Component\Transport\HttpTransportInterface;
use Mapbender\CoreBundle\Component\Source\SourceLoader;
use Mapbender\CoreBundle\Component\Source\StyleableSourceLoaderInterface;
use Mapbender\CoreBundle\Entity\Source;
use Mapbender\Exception\Loader\ServerResponseErrorException;
use Mapbender\Mapbender3DBundle\DataSource\Type\ThreeDTilesSourceType;
use Mapbender\Mapbender3DBundle\Entity\ThreeDTilesSource;
use Mapbender\Mapbender3DBundle\Entity\ThreeDTilesVariant;
use Symfony\Contracts\Translation\TranslatorInterface;

class ThreeDTilesLoader extends SourceLoader
{
    public function __construct(
        protected HttpTransportInterface $httpTransport,
        protected TranslatorInterface    $translator,
        protected EntityManagerInterface $em,
    )
    {
    }

    public function getDefaultModel(): ?Source
    {
        return new ThreeDTilesSource();
    }

    public function getFormTemplate(bool $forReload, ?Source $source): string
    {
        return '@Mapbender3D/DataSource/edit-source.html.twig';
    }

    public function getFormTemplateVariables(bool $forReload, ?Source $source): array
    {
        return ['reload' => $forReload];
    }

    public function loadSource(mixed $formData): Source
    {
        $source = new ThreeDTilesSource();
        $this->refreshSource($source, $formData);
        return $source;
    }

    public function refreshSource(Source $source, mixed $formData): void
    {
        /** @var ThreeDTilesSource $source */
        /** @var ThreeDTilesSource|array $formData */
        $url = is_array($formData) ? $formData['jsonUrl'] : $formData->getJsonUrl();
        $url = rtrim((string)$url, '/');

        $response = $this->httpTransport->getUrl($url);

        if (!$response->isOk()) {
            $statusLine = \preg_replace('#[\r\n].*$#m', '', $response->__toString());
            throw new ServerResponseErrorException($statusLine, $response->getStatusCode());
        }

        $json = json_decode($response->getContent(), true);
        if ($json === null) {
            throw new ServerResponseErrorException($this->translator->trans('mb.vectortiles.admin.error.no_json'), 401);
        }

        $source->setJsonUrl($url);
        $source->setTitle($json['title'] ?? basename($url, '.json'));
        $source->setDescription($json['description'] ?? '');
        $variant = is_array($formData)
            ? $formData['variant'] ?? $source->getVariant()
            : $formData->getVariant();
        $source->setVariant(is_string($variant) ? ThreeDTilesVariant::from($variant) : $variant);
        $source->setMappings(is_array($formData)
            ? $formData['mappings'] ?? $source->getMappings()
            : $formData->getMappings());
        $source->setMappingProperty(is_array($formData)
            ? $formData['mappingProperty'] ?? $source->getMappingProperty()
            : $formData->getMappingProperty());
        $source->setBuildingIdProperty(is_array($formData)
            ? $formData['buildingIdProperty'] ?? $source->getBuildingIdProperty()
            : $formData->getBuildingIdProperty());
        $source->setPointSize(is_array($formData)
            ? $formData['pointSize'] ?? $source->getPointSize()
            : $formData->getPointSize());
    }

    public function getFormType(): string
    {
        return ThreeDTilesSourceType::class;
    }

}
