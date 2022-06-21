<?php
namespace App\Controllers;
use \Core\View;
use \App\Models\Products;
class ProductsController extends \Core\Controller

{
    public function testAction(){
        $products = Products::getAll();
        View::renderTemplate('test.html', [
            'products' =>$products,
        ]);
    }
    public function  indexAction()
    {
        $products = Products::getAll();
        View::renderTemplate('welcome.blade.html',[
            'products' => $products
        ]);
    }
    
    public function  createAction()
    {
        $products = new Products();
        if (isset($_POST['submit'])) {
            $products->setName($_POST['name']);
            $products->setCategoryId($_POST['product_category_id']);
            $products->setDescription($_POST['description']);
            $products->setImage($_POST['first_image']);
            $products->setType($_POST['type']);
            $products->setMemoty($_POST['memory']);
            $products->setDetail($_POST['detail']);
            $products->setPrice($_POST['price']);

            $create = Products::create($products);
            
            if($create)
            {
                View::renderTemplate('manage.blade.html');
            }
        }
        View::renderTemplate('create-product.blade.html');
    }

    public function updateAction()
    {
        $products = new Products();
        $id = $_GET['id'];
        if(isset($_POST['submit']))
        {
            $products->setId($id);
            $products->setName($_POST['name']);
            $products->setCategoryId($_POST['product_category_id']);
            $products->setDescription($_POST['description']);
            $products->setImage($_POST['first_image']);
            $products->setType($_POST['type']);
            $products->setMemoty($_POST['memory']);
            $products->setDetail($_POST['detail']);
            $products->setPrice($_POST['price']);

            $update = Products::update($products); 

            if($update)
            {
                View::renderTemplate('manage.blade.html');
            }
        }  
        View::renderTemplate('update-product.blade.html');
    }


    public function deleteAction()
    {
        $products = new Products();
        $id = $_GET['id'];
        if(isset($_POST['submit']))
        {
            $products->setId($id);
            $delete = Products::delete($products);
            if($delete)
            {
                View::renderTemplate('manage.blade.html');
            }
        }
                View::renderTemplate('manage.blade.html');
    }
    
}