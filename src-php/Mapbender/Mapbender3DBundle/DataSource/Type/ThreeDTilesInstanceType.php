<?php

namespace Mapbender\Mapbender3DBundle\DataSource\Type;

use Mapbender\CoreBundle\Element\Type\MapbenderTypeTrait;
use Mapbender\ManagerBundle\Form\Type\SourceInstanceType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\Extension\Core\Type\IntegerType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Contracts\Translation\TranslatorInterface;

class ThreeDTilesInstanceType extends AbstractType
{
    use MapbenderTypeTrait;

    public function __construct(private readonly TranslatorInterface $translator)
    {
    }

    public function getParent(): ?string
    {
        return SourceInstanceType::class;
    }

    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('opacity', IntegerType::class, [
                'required' => false,
                'label' => 'mb.manager.source.option.opacity',
            ])
            ->add('allowSelected', CheckboxType::class, [
                'required' => false,
                'label' => 'mb.ogcapifeatures.admin.layer.allow_selected',
            ])
            ->add('selected', CheckboxType::class, [
                'required' => false,
                'label' => 'mb.ogcapifeatures.admin.layer.selected',
            ]);
    }

}
