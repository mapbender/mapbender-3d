<?php

namespace Mapbender\ThreeDTilesBundle\Entity;

enum ThreeDTilesVariant: string
{
    case LOD2 = 'lod2';
    case TEXTURED_MESH = 'textured_mesh';
    case POINT_CLOUD = 'pointcloud';
}
