<?php

namespace Mapbender\Mapbender3DBundle\DataSource\Type;

use Mapbender\CoreBundle\Element\Type\PaintType;
use Mapbender\ManagerBundle\Form\Type\SourceType;
use Mapbender\Mapbender3DBundle\Entity\ThreeDTilesVariant;
use Symfony\Component\Form\Extension\Core\Type\ColorType;
use Symfony\Component\Form\Extension\Core\Type\EnumType;
use Symfony\Component\Form\Extension\Core\Type\IntegerType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\UrlType;
use Symfony\Component\Form\FormBuilderInterface;

class ThreeDTilesSourceType extends SourceType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('jsonUrl', UrlType::class, [
                'label' => 'mapbender.3d.3dtiles.admin.json_url',
            ])
            ->add('variant', EnumType::class, [
                'class' => ThreeDTilesVariant::class,
                'label' => 'mapbender.3d.3dtiles.admin.variant',
            ])
            ->add('surfaceProperty', TextType::class, [
                'required' => false,
                'label' => 'mapbender.3d.3dtiles.admin.surface_property',
                'attr' => [
                    'data-variant' => ThreeDTilesVariant::LOD2->value,
                ],
            ])
            ->add('buildingIdProperty', TextType::class, [
                'required' => false,
                'label' => 'mapbender.3d.3dtiles.admin.building_id_property',
                'attr' => [
                    'data-variant' => ThreeDTilesVariant::LOD2->value,
                ],
            ])
            ->add('roofColor', TextType::class, [
                'required' => false,
                'label' => 'mapbender.3d.3dtiles.admin.roof_color',
                'attr' => [
                    'data-variant' => ThreeDTilesVariant::LOD2->value,
                    'class' => '-js-init-colorpicker',
                ],
            ])
            ->add('wallColor', TextType::class, [
                'required' => false,
                'label' => 'mapbender.3d.3dtiles.admin.wall_color',
                'attr' => [
                    'data-variant' => ThreeDTilesVariant::LOD2->value,
                    'class' => '-js-init-colorpicker',
                ],
            ])
            ->add('selectionColor', TextType::class, [
                'required' => false,
                'label' => 'mapbender.3d.3dtiles.admin.selection_color',
                'attr' => [
                    'data-variant' => ThreeDTilesVariant::LOD2->value,
                    'class' => '-js-init-colorpicker',
                ],
            ])
            ->add('pointSize', IntegerType::class, [
                'required' => false,
                'label' => 'mapbender.3d.3dtiles.admin.point_size',
                'attr' => [
                    'data-variant' => ThreeDTilesVariant::POINT_CLOUD->value,
                ],
            ]);
    }
}
