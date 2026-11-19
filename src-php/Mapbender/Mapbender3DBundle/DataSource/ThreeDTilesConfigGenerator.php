<?php

namespace Mapbender\Mapbender3DBundle\DataSource;

use Doctrine\ORM\EntityManagerInterface;
use Mapbender\CoreBundle\Component\Source\SourceInstanceConfigGenerator;
use Mapbender\CoreBundle\Entity\Application;
use Mapbender\CoreBundle\Entity\SourceInstance;
use Mapbender\Mapbender3DBundle\Entity\ThreeDTilesInstance;
use Mapbender\Mapbender3DBundle\Entity\ThreeDTilesSource;
use Symfony\Component\Routing\RouterInterface;
use Twig\Environment;

class ThreeDTilesConfigGenerator extends SourceInstanceConfigGenerator
{
    public function __construct(
        protected EntityManagerInterface $em,
        protected Environment            $twig,
        protected RouterInterface        $router,
    )
    {
    }

    public function getAssets(Application $application, string $type): array
    {
        return match ($type) {
            'js' => [
                '@Mapbender3DBundle/Resources/public/js/three_d_tiles/geosource.3d_tiles.source.js',
                '@Mapbender3DBundle/Resources/public/js/three_d_tiles/geosource.3d_tiles.source-layer.js',
            ],
            'css' => [
            ],
            default => [],
        };
    }

    public function getConfiguration(Application $application, SourceInstance $sourceInstance, ?string $idPrefix = null): array
    {
        /** @var ThreeDTilesInstance $sourceInstance */
        /** @var ThreeDTilesSource $source */
        $source = $sourceInstance->getSource();
        $config = parent::getConfiguration($application, $sourceInstance, $idPrefix);
        $config['options'] = [
            'id' => $sourceInstance->getId(),
            'jsonUrl' => $source->getJsonUrl(),
            'title' => $sourceInstance->getTitle() ?: $source->getTitle(),
            'opacity' => ($sourceInstance->getOpacity() ?? 100) / 100.0,
            'variant' => $source->getVariant()->value,
            'surfaceProperty' => $source->getSurfaceProperty(),
            'buildingIdProperty' => $source->getBuildingIdProperty(),
            'roofColor' => $sourceInstance->getRoofColor() ?? $source->getRoofColor(),
            'wallColor' => $sourceInstance->getWallColor() ?? $source->getWallColor(),
            'selectionColor' => $sourceInstance->getSelectionColor() ?? $source->getSelectionColor(),
            'pointSize' => $sourceInstance->getPointSize() ?? $source->getPointSize(),
            'treeOptions' => [
                'selected' => $sourceInstance->getSelected(),
                'allow' => [
                    'selected' => $sourceInstance->getAllowSelected(),
                ],
            ],
        ];

        return $config;
    }

}
