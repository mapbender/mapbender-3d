<?php

namespace Mapbender\Mapbender3DBundle\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Mapbender\CoreBundle\Entity\Source;
use Mapbender\Mapbender3DBundle\DataSource\ThreeDTilesDataSource;

#[ORM\Entity]
#[ORM\Table(name: 'mb_3d_tiles_source')]
class ThreeDTilesSource extends Source
{
    #[ORM\OneToMany(mappedBy: 'source', targetEntity: ThreeDTilesInstance::class, cascade: ['remove'])]
    protected Collection $instances;

    #[ORM\Column(name: 'json_url', type: 'string', nullable: true)]
    private ?string $jsonUrl = null;

    #[ORM\Column(type: 'string', nullable: true)]
    protected ?string $version = "";

    #[ORM\Column(type: Types::ENUM, nullable: false)]
    protected ThreeDTilesVariant $variant = ThreeDTilesVariant::TEXTURED_MESH;

    #[ORM\Column(name: 'surface_property', type: 'string', nullable: true)]
    private ?string $surfaceProperty = 'surface';

    #[ORM\Column(name: 'building_id_property', type: 'string', nullable: true)]
    private ?string $buildingIdProperty = 'gml_id';

    #[ORM\Column(name: 'roof_color', type: 'string', nullable: true)]
    private ?string $roofColor = 'rgb(255, 80, 80)';

    #[ORM\Column(name: 'wall_color', type: 'string', nullable: true)]
    private ?string $wallColor = 'rgb(170, 170, 170)';

    #[ORM\Column(name: 'selection_color', type: 'string', nullable: true)]
    private ?string $selectionColor = 'rgb(91, 154, 227)';

    #[ORM\Column(name: 'point_size', type: 'integer', nullable: true)]
    private ?int $pointSize = 2;

    public function __construct()
    {
        parent::__construct();
        $this->setType(ThreeDTilesDataSource::TYPE);
        $this->instances = new ArrayCollection();
    }

    public function getJsonUrl(): ?string
    {
        return $this->jsonUrl;
    }

    public function setJsonUrl(?string $jsonUrl): void
    {
        $this->jsonUrl = $jsonUrl;
    }

    public function getVariant(): ThreeDTilesVariant
    {
        return $this->variant;
    }

    public function setVariant(ThreeDTilesVariant $variant): void
    {
        $this->variant = $variant;
    }

    public function getSurfaceProperty(): string
    {
        return $this->surfaceProperty;
    }

    public function setSurfaceProperty(string $surfaceProperty): void
    {
        $this->surfaceProperty = $surfaceProperty;
    }

    public function getBuildingIdProperty(): string
    {
        return $this->buildingIdProperty;
    }

    public function setBuildingIdProperty(string $buildingIdProperty): void
    {
        $this->buildingIdProperty = $buildingIdProperty;
    }

    public function getRoofColor(): string
    {
        return $this->roofColor;
    }

    public function setRoofColor(string $roofColor): void
    {
        $this->roofColor = $roofColor;
    }

    public function getWallColor(): string
    {
        return $this->wallColor;
    }

    public function setWallColor(string $wallColor): void
    {
        $this->wallColor = $wallColor;
    }

    public function getSelectionColor(): string
    {
        return $this->selectionColor;
    }

    public function setSelectionColor(string $selectionColor): void
    {
        $this->selectionColor = $selectionColor;
    }

    public function getPointSize(): int
    {
        return $this->pointSize;
    }

    public function setPointSize(int $pointSize): void
    {
        $this->pointSize = $pointSize;
    }


    public function getInstances(): Collection|array
    {
        return $this->instances;
    }

    public function getLayers(): Collection|array
    {
        return [];
    }

    public function getDisplayUrl(): ?string
    {
        return $this->jsonUrl;
    }

    public function getVersion(): ?string
    {
        return "-";
    }
}
