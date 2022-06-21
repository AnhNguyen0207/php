<?php

namespace App\Models;
use Core\Model;
use PDO;

class Products extends Model
{
    private $id;
    private $name;
    private $description;
    private $first_image;
    private $type;
    private $memory;
    private $detail;
    private $price;

    public function __construct($products = [])
    {
        foreach ($products as $key => $value) {
            $this->$key = $value;
        };
    }

    function getId()
    {
        return $this->id;
    }
    function setId($id)
    {
        $this->id = $id;
    }

    function getName()
    {
        return $this->name;
    }
    function setName($name)
    {
       $this->name = $name; 
    }

    function getDescription()
    {
        return $this->description;
    }
    function setDescription($description)
    {
       $this->description = $description; 
    }

    function getImage()
    {
        return $this->first_image;
    }
    function setImage($first_image)
    {
       $this->first_image = $first_image; 
    }

    function getType()
    {
        return $this->type;
    }
    function setType($type)
    {
       $this->type = $type; 
    }

    function getMemory()
    {
        return $this->memory;
    }
    function setMemoty($memory)
    {
       $this->memory = $memory; 
    }

    function getDetail()
    {
        return $this->detail;
    }
    function setDetail($detail)
    {
       $this->detail = $detail; 
    }

    function getPrice()
    {
        return $this->price;
    }
    function setPrice($price)
    {
       $this->price = $price; 
    }



    public static function getAll($relation = [])
    {
        $sql = 'SELECT * FROM products';
        $db = static::getDB();
        $stmt = $db->prepare($sql);
        $stmt->execute();
        $products = $stmt->fetchAll();
        if((isset($relation['productItem']))){
            foreach($products as $key=>$product){
                $dbItem = "SELECT * FROM product_item where product_id = '$product->id'";
                $s = $db->prepare($dbItem);
                $s->setFetchMode(PDO::FETCH_CLASS, get_called_class());
                $s->execute();
                $products[$key]->items = $s->fetchAll();
            }
        }
        return $products;
    }
    
    public static function create(Products $products)
    {
        $sql = "INSERT INTO products (name, description, first_image, type, memory, detail, price) 
                VALUES ('$products->name','$products->description','$products->first_image','$products->type','$products->memory','$products->detail','$products->price')";
        $db = static::getDB();
        $stmt = $db->prepare($sql);
        $stmt->setFetchMode(PDO::FETCH_CLASS, get_called_class());

        $item = "SELECT * FROM product_item where product_id = '$id'";
        $i = $db->prepare($item);
        $i->execute();
        $product->items = $i->fetchAll();
        return $stmt->execute();
       
    
    }
    public static function findById($id)
    {
        $sql = "SELECT * FROM products WHERE id = '$id'";
        $db = static::getDB();
        $stmt = $db->prepare($sql);     
        $stmt->setFetchMode(PDO::FETCH_CLASS, get_called_class());
        $stmt->execute();
        $product=$stmt->fetch();

        $item = "SELECT * FROM product_item where product_id = '$id'";
        $i = $db->prepare($item);
        $i->execute();
        $product->items = $i->fetchAll();

        return $product;
    }
    public static function update(Products $products)
    {
        $sql = "UPDATE products SET name = '$products->name', product_category_id = '$products->product_category_id', description = '$products->description', first_image = '$products->first_image', type = '$products->type', memory = '$products->memory', detail = '$products->detail', price = '$products->price' WHERE id = '$products->id'";
        $db = static::getDB();
        $stmt = $db->prepare($sql);
        $stmt->setFetchMode(PDO::FETCH_CLASS, get_called_class());
        return $stmt->execute();
        
    }
     public static function delete(Products $products)
     {
        $sql = "DELETE FROM products WHERE id = '$products->id'";
        $db = static::getDB();
        $stmt = $db->prepare($sql);
        $stmt->setFetchMode(PDO::FETCH_CLASS, get_called_class());
        $result = $stmt->execute();  
        if($result)
        {
            return true;
        }else{
            return false;
        }

     }
}
    
    
