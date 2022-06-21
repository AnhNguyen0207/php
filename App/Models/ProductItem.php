<?php

namespace App\Models;
use Core\Model;
use PDO;

class ProductItem extends Model
{
    private $id;
    private $product_id;
    private $type;
    private $value;
    private $image;
}