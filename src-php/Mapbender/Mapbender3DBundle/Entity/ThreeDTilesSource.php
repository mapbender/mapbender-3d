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
