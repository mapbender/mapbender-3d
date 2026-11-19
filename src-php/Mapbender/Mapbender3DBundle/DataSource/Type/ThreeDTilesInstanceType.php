<?php

namespace Mapbender\Mapbender3DBundle\DataSource\Type;

use Mapbender\CoreBundle\Element\Type\MapbenderTypeTrait;
use Mapbender\ManagerBundle\Form\Type\SourceInstanceType;
use Mapbender\Mapbender3DBundle\Entity\ThreeDTilesInstance;
use Mapbender\Mapbender3DBundle\Entity\ThreeDTilesSource;
use Mapbender\Mapbender3DBundle\Entity\ThreeDTilesVariant;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\Extension\Core\Type\ColorType;
use Symfony\Component\Form\Extension\Core\Type\IntegerType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
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
        /** @var ThreeDTilesInstance $instance */
        $instance = $options['data'];
        /** @var ThreeDTilesSource $source */
        $source = $instance->getSource();

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

        if ($source->getVariant() === ThreeDTilesVariant::LOD2) {
            $this->addLod2Fields($builder, $source);
        }

        if ($source->getVariant() === ThreeDTilesVariant::POINT_CLOUD) {
            $this->addPointCloudFields($builder, $source);
        }
    }

    private function addLod2Fields(FormBuilderInterface $builder, ThreeDTilesSource $source): void
    {
        $builder
            ->add('roofColor', TextType::class, [
                'required' => false,
                'label' => 'mapbender.3d.3dtiles.admin.roof_color',
                'attr' => [
                    'data-variant' => ThreeDTilesVariant::LOD2->value,
                    'placeholder' => $source->getRoofColor(),
                    'class' => '-js-init-colorpicker',
                ],
            ])
            ->add('wallColor', TextType::class, [
                'required' => false,
                'label' => 'mapbender.3d.3dtiles.admin.wall_color',
                'attr' => [
                    'data-variant' => ThreeDTilesVariant::LOD2->value,
                    'placeholder' => $source->getWallColor(),
                    'class' => '-js-init-colorpicker',
                ],
            ])
            ->add('selectionColor', TextType::class, [
                'required' => false,
                'label' => 'mapbender.3d.3dtiles.admin.selection_color',
                'attr' => [
                    'data-variant' => ThreeDTilesVariant::LOD2->value,
                    'placeholder' => $source->getSelectionColor(),
                    'class' => '-js-init-colorpicker',
                ],
            ]);
    }

    private function addPointCloudFields(FormBuilderInterface $builder, ThreeDTilesSource $source): void
    {
        $builder->add('pointSize', IntegerType::class, [
            'required' => false,
            'label' => 'mapbender.3d.3dtiles.admin.point_size',
            'attr' => [
                'data-variant' => ThreeDTilesVariant::POINT_CLOUD->value,
                'placeholder' => $source->getPointSize(),
            ],
        ]);
    }

}

