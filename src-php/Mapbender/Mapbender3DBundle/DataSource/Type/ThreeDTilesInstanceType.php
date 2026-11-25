<?php

namespace Mapbender\Mapbender3DBundle\DataSource\Type;

use Mapbender\CoreBundle\Element\Type\MapbenderTypeTrait;
use Mapbender\ManagerBundle\Form\Type\SourceInstanceType;
use Mapbender\Mapbender3DBundle\Entity\ThreeDTilesInstance;
use Mapbender\Mapbender3DBundle\Entity\ThreeDTilesSource;
use Mapbender\Mapbender3DBundle\Entity\ThreeDTilesVariant;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
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

        if ($source->getVariant() === ThreeDTilesVariant::POINT_CLOUD) {
            $builder->add('pointSize', IntegerType::class, [
                'required' => false,
                'label' => 'mapbender.3d.3dtiles.admin.point_size',
                'attr' => [
                    'data-variant' => ThreeDTilesVariant::POINT_CLOUD->value,
                    'placeholder' => $source->getPointSize(),
                ],
            ]);
        }

        if ($source->getVariant() === ThreeDTilesVariant::LOD2) {
            $builder->add('mappingProperty', TextType::class, [
                'required' => false,
                'label' => 'mapbender.3d.3dtiles.admin.mapping_property',
                'attr' => [
                    'data-variant' => ThreeDTilesVariant::LOD2->value,
                    'placeholder' => $source->getMappingProperty(),
                ],
            ])
                ->add('defaultColor', TextType::class, [
                    'required' => false,
                    'label' => 'mapbender.3d.3dtiles.admin.default_color',
                    'attr' => [
                        'data-variant' => ThreeDTilesVariant::LOD2->value,
                        'placeholder' => $source->getDefaultColor(),
                        'class' => '-js-init-colorpicker',
                    ],
                ]);

            foreach ($source->getMappings() as $index => $mapping) {
                $property = $mapping['property'];
                $builder->add('mappingColor' . $index, TextType::class, [
                    'required' => false,
                    'label' => $property,
                    'property_path' => 'mappingColors[' . $property . ']',
                    'attr' => [
                        'data-variant' => ThreeDTilesVariant::LOD2->value,
                        'placeholder' => $mapping['value'],
                        'class' => '-js-init-colorpicker',
                    ],
                ]);
            }
        }
    }

}
