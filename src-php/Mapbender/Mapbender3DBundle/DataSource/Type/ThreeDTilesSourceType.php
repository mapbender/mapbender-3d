<?php

namespace Mapbender\Mapbender3DBundle\DataSource\Type;

use Mapbender\CoreBundle\Element\Type\CollapsibleCollectionType;
use Mapbender\ManagerBundle\Form\Type\SourceType;
use Mapbender\Mapbender3DBundle\Entity\ThreeDTilesSource;
use Mapbender\Mapbender3DBundle\Entity\ThreeDTilesVariant;
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
            ->add('buildingIdProperty', TextType::class, [
                'required' => false,
                'label' => 'mapbender.3d.3dtiles.admin.building_id_property',
                'attr' => [
                    'data-variant' => ThreeDTilesVariant::LOD2->value,
                ],
            ])
            ->add('mappingProperty', TextType::class, [
                'required' => false,
                'label' => 'mapbender.3d.3dtiles.admin.mapping_property',
                'attr' => [
                    'data-variant' => ThreeDTilesVariant::LOD2->value,
                ],
            ])
            ->add('defaultColor', TextType::class, [
                'required' => false,
                'label' => 'mapbender.3d.3dtiles.admin.default_color',
                'attr' => [
                    'data-variant' => ThreeDTilesVariant::LOD2->value,
                    'class' => '-js-init-colorpicker',
                ],
            ])
            ->add('mappings', CollapsibleCollectionType::class, [
                'label' => 'mapbender.3d.3dtiles.admin.mappings',
                'allow_add' => true,
                'attr' => [
                    'data-defaults' => json_encode(ThreeDTilesSource::defaultMappings()),
                    'data-variant' => ThreeDTilesVariant::LOD2->value,
                ],
                'allow_delete' => true,
                'initial_collapse_state' => CollapsibleCollectionType::INITIAL_STATE_ALL_OPENED,
                'entry_type' => ThreeDTilesSourceMappingType::class,
                'error_bubbling' => false,
                'required' => false,
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
