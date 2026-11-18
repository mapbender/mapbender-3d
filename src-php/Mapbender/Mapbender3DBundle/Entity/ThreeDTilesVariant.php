<?php

namespace Mapbender\Mapbender3DBundle\Entity;

use Symfony\Contracts\Translation\TranslatableInterface;
use Symfony\Contracts\Translation\TranslatorInterface;

enum ThreeDTilesVariant: string implements TranslatableInterface
{
    case TEXTURED_MESH = 'textured_mesh';
    case LOD2 = 'lod2';
    case POINT_CLOUD = 'pointcloud';

    public function trans(TranslatorInterface $translator, ?string $locale = null): string
    {
        return $translator->trans('mapbender.3d.3dtiles.variant.' . $this->value, locale: $locale);
    }
}
