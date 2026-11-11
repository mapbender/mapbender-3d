<?php

namespace Mapbender\Mapbender3DBundle\Element;

use Mapbender\Component\Element\AbstractElementService;
use Mapbender\Component\Element\TemplateView;
use Mapbender\CoreBundle\Component\ElementBase\FloatableElement;
use Mapbender\CoreBundle\Entity\Element;
use Symfony\Component\DependencyInjection\Attribute\AutoconfigureTag;
use Mapbender\Mapbender3DBundle\Element\Type\ThreeDViewAdminType;
use Symfony\Component\HttpFoundation\RequestStack;

#[AutoconfigureTag('mapbender.element')]
class ThreeDView extends AbstractElementService implements FloatableElement
{
    public function __construct(
        private readonly string $iframeUrl,
        private readonly RequestStack $requestStack,
    )
    {
    }

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
        ];
    }

    public function getClientConfiguration(Element $element)
    {
        $iframeUrl = $this->iframeUrl;
        if (!str_starts_with($iframeUrl, 'http')) {
            $basePath = $this->requestStack->getCurrentRequest()->getBasePath();
            $iframeUrl = $basePath . "/" . (str_starts_with($iframeUrl, '/') ? substr($iframeUrl, 1) : $iframeUrl);
        }

        $config = parent::getClientConfiguration($element);
        $config['iframeUrl'] = $iframeUrl;
        return $config;
    }

    public static function getFormTemplate()
    {
        return '@Mapbender3D/ElementAdmin/3dviewadmin.html.twig';
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

        $view = new TemplateView('@Mapbender3D/Element/3dview.html.twig');
        $view->attributes['class'] = 'mb-element mb-element-3dview';
        $view->attributes['title'] = $element->getTitle() ?: self::getClassTitle();
        $view->variables['label'] = $config['buttonLabel'] ?: '3D';
        $view->variables['frameTitle'] = $element->getTitle() ?: self::getClassTitle();

        return $view;
    }
}


