<?php

namespace Mapbender\Mapbender3DBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Mapbender\CoreBundle\Entity\SourceInstance;
use \Mapbender\CoreBundle\Entity\Source;

#[ORM\Entity]
#[ORM\Table(name: 'mb_3d_tiles_instance')]
class ThreeDTilesInstance extends SourceInstance
{
    #[ORM\ManyToOne(targetEntity: ThreeDTilesSource::class, cascade: ['refresh'], inversedBy: 'instances')]
    #[ORM\JoinColumn(name: 'source', referencedColumnName: 'id', onDelete: 'CASCADE')]
    protected Source $source;

    #[ORM\Column(type: 'integer', nullable: true)]
    protected ?int $opacity = 100;

    #[ORM\Column(type: 'boolean', nullable: true)]
    protected ?bool $allowSelected = true;

    #[ORM\Column(type: 'boolean', nullable: true)]
    protected ?bool $selected = true;

    #[ORM\Column(name: 'mapping_property', type: 'string', nullable: true)]
    protected ?string $mappingProperty = null;

    #[ORM\Column(name: 'default_color', type: 'string', nullable: true)]
    protected ?string $defaultColor = null;

    #[ORM\Column(name: 'mapping_colors', type: 'json', nullable: true)]
    protected ?array $mappingColors = null;

    #[ORM\Column(name: 'point_size', type: 'integer', nullable: true)]
    protected ?int $pointSize = null;

    public function getSource(): Source
    {
        return $this->source;
    }

    public function setSource($source)
    {
        $this->source = $source;
    }

    public function getLayers()
    {
        return [];
    }

    public function getOpacity(): ?int
    {
        return $this->opacity;
    }

    public function setOpacity(?int $opacity): void
    {
        $this->opacity = $opacity;
    }

    public function getAllowSelected(): ?bool
    {
        return $this->allowSelected;
    }

    public function setAllowSelected(?bool $allowSelected): void
    {
        $this->allowSelected = $allowSelected;
    }

    public function getSelected(): ?bool
    {
        return $this->selected;
    }

    public function setSelected(?bool $selected): void
    {
        $this->selected = $selected;
    }

    public function getMappingProperty(): ?string
    {
        return $this->mappingProperty;
    }

    public function setMappingProperty(?string $mappingProperty): void
    {
        $this->mappingProperty = $mappingProperty;
    }

    public function getDefaultColor(): ?string
    {
        return $this->defaultColor;
    }

    public function setDefaultColor(?string $defaultColor): void
    {
        $this->defaultColor = $defaultColor;
    }

    public function getMappingColors(): array
    {
        return $this->mappingColors ?? [];
    }

    public function setMappingColors(?array $mappingColors): void
    {
        $this->mappingColors = $mappingColors;
    }

    public function getPointSize(): ?int
    {
        return $this->pointSize;
    }

    public function setPointSize(?int $pointSize): void
    {
        $this->pointSize = $pointSize;
    }

    public function __clone()
    {
        if ($this->id) {
            $this->setId(null);
        }
    }

    public function getDisplayTitle(): string
    {
        return $this->getTitle() ?: $this->getSource()->getTitle();
    }
}
