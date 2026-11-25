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

    #[ORM\Column(name: 'mapping_property', type: 'string', nullable: true)]
    private ?string $mappingProperty = 'surface';

    #[ORM\Column(name: 'default_color', type: 'string', nullable: true)]
    private ?string $defaultColor = 'rgb(170, 170, 170)';

    public static function defaultMappings(): array
    {
        return [
            [
                "property" => "roofColor",
                "value" => "rgb(255, 80, 80)",
            ],
            [
                "property" => "wallColor",
                "value" => "rgb(170, 170, 170)",
            ],
            [
                "property" => "selectionColor",
                "value" => "rgb(91, 154, 227)",
            ],
        ];
    }

    #[ORM\Column(name: 'mappings', type: 'json', nullable: true)]
    private ?array $mappings = null;

    #[ORM\Column(name: 'building_id_property', type: 'string', nullable: true)]
    private ?string $buildingIdProperty = 'gml_id';

    #[ORM\Column(name: 'point_size', type: 'integer', nullable: true)]
    private ?int $pointSize = 2;

    public function __construct()
    {
        parent::__construct();
        $this->setType(ThreeDTilesDataSource::TYPE);
        $this->mappings = self::defaultMappings();
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

    public function getMappingProperty(): string
    {
        return $this->mappingProperty;
    }

    public function setMappingProperty(string $mappingProperty): void
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

    public function getMappings(): array
    {
        return $this->mappings ?? self::defaultMappings();
    }

    public function setMappings(string|array|null $mappings): void
    {
        if (is_string($mappings)) {
            $mappings = json_decode($mappings, true);
        }
        $this->mappings = $mappings;
    }

    public function getBuildingIdProperty(): string
    {
        return $this->buildingIdProperty;
    }

    public function setBuildingIdProperty(string $buildingIdProperty): void
    {
        $this->buildingIdProperty = $buildingIdProperty;
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
