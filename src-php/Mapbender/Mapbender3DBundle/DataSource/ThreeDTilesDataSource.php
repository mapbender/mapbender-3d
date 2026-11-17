<?php

namespace Mapbender\Mapbender3DBundle\DataSource;

use Mapbender\CoreBundle\Component\Source\DataSource;
use Mapbender\CoreBundle\Component\Source\SourceInstanceConfigGenerator;
use Mapbender\CoreBundle\Component\Source\SourceInstanceFactory;
use Mapbender\CoreBundle\Component\Source\SourceLoader;
use Mapbender\PrintBundle\Component\LayerRenderer;
use Mapbender\ThreeDTilesBundle\Entity\ThreeDTilesSource;

class ThreeDTilesDataSource extends DataSource
{
    const TYPE = '3dtiles';

    public function __construct(
        private readonly ThreeDTilesConfigGenerator $configService,
        private readonly ThreeDTilesInstanceFactory $instanceFactory,
        private readonly ThreeDTilesLoader $loader,
        private readonly ThreeDTilesRenderer $layerRenderer
    )
    {
    }

    public function getName(): string
    {
        return self::TYPE;
    }

    public function getLabel(bool $compact = false): string
    {
        return '3D-Tiles';
    }

    public function getConfigGenerator(): SourceInstanceConfigGenerator
    {
        return $this->configService;
    }

    public function getInstanceFactory(): SourceInstanceFactory
    {
        return $this->instanceFactory;
    }

    public function getLoader(): SourceLoader
    {
        return $this->loader;
    }

    public function getLayerRenderer(): LayerRenderer
    {
        return $this->layerRenderer;
    }

    public function getSourceEntityClass(): string
    {
        return ThreeDTilesSource::class;
    }

    public function getMetadataFrontendTemplate(): ?string
    {
        return null;
    }

    public function getMetadataBackendTemplate(): ?string
    {
        return null;
    }

    public function getAccentColor(): string
    {
        return 'success';
    }

    public function getEntityTypeDiscriminator(): string
    {
        return self::TYPE;
    }
}
