<?php

namespace Mapbender\Mapbender3DBundle\DataSource\Type;

use Mapbender\Mapbender3DBundle\Entity\ThreeDTilesVariant;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;

class ThreeDTilesSourceMappingType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('property', TextType::class, [
                'required' => false,
                'label' => 'mapbender.3d.3dtiles.admin.mappings_property',
                'attr' => [
                    'data-variant' => ThreeDTilesVariant::LOD2->value,
                ],
            ])
            ->add('value', TextType::class, [
                'required' => false,
                'label' => 'mapbender.3d.3dtiles.admin.mappings_value',
                'attr' => [
                    'data-variant' => ThreeDTilesVariant::LOD2->value,
                    'class' => '-js-init-colorpicker',
                ],
            ]);
    }

}
