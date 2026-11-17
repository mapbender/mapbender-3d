<?php

namespace Mapbender\Mapbender3DBundle\DataSource;

use Doctrine\ORM\EntityManagerInterface;
use Mapbender\CoreBundle\Component\Source\SourceInstanceConfigGenerator;
use Mapbender\CoreBundle\Entity\Application;
use Mapbender\CoreBundle\Entity\SourceInstance;
use Mapbender\ThreeDTilesBundle\Entity\ThreeDTilesInstance;
use Mapbender\ThreeDTilesBundle\Entity\ThreeDTilesSource;
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
                '@Mapbender3DBundle/Resources/public/js/three_d_tiles/geosource.3d_tiles.js',
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
            'treeOptions' => [
                'selected' => $sourceInstance->getSelected(),
                'toggle' => $sourceInstance->getToggle(),
                'allow' => [
                    'selected' => $sourceInstance->getAllowSelected(),
                    'toggle' => $sourceInstance->getAllowToggle(),
                ],
            ],
        ];

        return $config;
    }

}
