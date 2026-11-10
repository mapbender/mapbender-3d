<?php

namespace Mapbender\Mapbender3DBundle\Element;

use Mapbender\Component\Element\AbstractElementService;
use Mapbender\Component\Element\TemplateView;
use Mapbender\CoreBundle\Component\ElementBase\FloatableElement;
use Mapbender\CoreBundle\Entity\Element;
use Symfony\Component\DependencyInjection\Attribute\AutoconfigureTag;
use Mapbender\Mapbender3DBundle\Element\Type\ThreeDViewAdminType;

#[AutoconfigureTag('mapbender.element')]
class ThreeDView extends AbstractElementService implements FloatableElement
{
    public static function getClassTitle()
    {
        return 'mapbender.3d.element.title';
    }

    public static function getClassDescription()
    {
        return 'mapbender.3d.element.description';
    }

    public static function getType()
    {
        return ThreeDViewAdminType::class;
    }

    public static function getDefaultConfiguration()
    {
        return [
            'buttonLabel' => '3D',
            'iframeUrl' => '/bundles/mapbender3d/iframe/index.html',
        ];
    }

    public static function getFormTemplate()
    {
        return '@Mapbender3DBundle/Resources/views/ElementAdmin/3dviewadmin.html.twig';
    }

    public function getRequiredAssets(Element $element)
    {
        return [
            'js' => [
                '@Mapbender3DBundle/Resources/public/js/Mb3DView.js',
            ],
            'css' => [
                '@Mapbender3DBundle/Resources/public/css/mapbender.element.3dview.css',
            ],
            'trans' => [],
        ];
    }

    public function getWidgetName(Element $element)
    {
        return 'Mb3DView';
    }

    public function getView(Element $element)
    {
        $config = $element->getConfiguration();

        $view = new TemplateView('@Mapbender3DBundle/Resources/views/Element/3dview.html.twig');
        $view->attributes['class'] = 'mb-element mb-element-3dview';
        $view->attributes['title'] = $element->getTitle() ?: self::getClassTitle();
        $view->variables['label'] = $config['buttonLabel'] ?: '3D';
        $view->variables['frameTitle'] = $element->getTitle() ?: self::getClassTitle();

        return $view;
    }
}


