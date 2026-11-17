<?php

namespace Mapbender\ThreeDTilesBundle\Form\Type;

use Mapbender\ManagerBundle\Form\Type\SourceType;
use Mapbender\ThreeDTilesBundle\Entity\ThreeDTilesVariant;
use Symfony\Component\Form\Extension\Core\Type\EnumType;
use Symfony\Component\Form\Extension\Core\Type\UrlType;
use Symfony\Component\Form\FormBuilderInterface;

class ThreeDTilesSourceType extends SourceType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('jsonUrl', UrlType::class, [
                'label' => 'mb.threedtiles.admin.json_url',
            ])
            ->add('variant', EnumType::class, [
                'class' => ThreeDTilesVariant::class,
                'label' => 'Variante',
                'expanded' => true,
            ]);
    }
}
