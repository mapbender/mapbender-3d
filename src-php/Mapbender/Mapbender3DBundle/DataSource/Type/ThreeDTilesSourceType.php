<?php

namespace Mapbender\Mapbender3DBundle\DataSource\Type;

use Mapbender\ManagerBundle\Form\Type\SourceType;
use Mapbender\Mapbender3DBundle\Entity\ThreeDTilesVariant;
use Symfony\Component\Form\Extension\Core\Type\EnumType;
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
            ]);
    }
}
