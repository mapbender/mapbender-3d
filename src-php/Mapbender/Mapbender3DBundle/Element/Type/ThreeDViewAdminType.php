<?php

namespace Mapbender\Mapbender3DBundle\Element\Type;

use Mapbender\CoreBundle\Element\Type\MapbenderTypeTrait;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;

class ThreeDViewAdminType extends AbstractType
{
    use MapbenderTypeTrait;

    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('buttonLabel', TextType::class, [
                'required' => false,
                'label' => 'mb.3d.element.admin.button_label',
            ])
        ;
    }
}

