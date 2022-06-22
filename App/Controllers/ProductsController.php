<?php
namespace App\Controllers;
use  Core\View;
use  App\Models\Products;
class ProductsController extends \Core\Controller

{
    public function testAction(){
        $relation['productItem'] = 1;
        $products = Products::getAll();
        View::renderTemplate('test.html', [
            'products' =>$products,
        ]);
    }
    
    public function  manageAction()
    {
        if(isset($_SESSION['auth']) && !empty($_SESSION['auth'])){
            $products = Products::getAll();
            View::renderTemplate('manage.html',
            ['products' => $products]);
        } else{
            header('Location: /login');
        }
    }
    
    public function  createAction()
    {
        $products = new Products();

        if (isset($_POST['submit'])) {
            $products->setName($_POST['name']);
            $products->setDescription($_POST['description']);
            $products->setFirstImage($_POST['first_image']);
            $products->setSecondImage($_POST['second_image']);
            $products->setThirdImage($_POST['third_image']);
            $products->setType(($_POST['typeProduct']));
            $products->setStatus(($_POST['status']));
            $products->setMemoty($_POST['memory']);
            $products->setDetail(isset($_POST['detail']) ? $_POST['detail'] : '');
            $products->setPrice($_POST['price']);
            $products->setCam(($_POST['cam']));
            $products->setDisplay($_POST['display']);
            $products->setRam($_POST['ram']);
            $products->setColor($_POST['color']);
            

            $create = Products::create($products);           
            if($create)
            {
                $_SESSION["alert"] = 'success';
                header('Location: /products/manage');
            }
        }
        View::renderTemplate('create-product.html');
    }

    public function updateAction()
    {
        $products = new Products();
        $id = $_GET['id'];

        if(isset($_POST['submit']))
        {
            $products->setId($id);
            $products->setName($_POST['name']);
            $products->setDescription($_POST['description']);
            $products->setFirstImage($_POST['first_image']);
            $products->setSecondImage($_POST['second_image']);
            $products->setThirdImage($_POST['third_image']);
            $products->setType($_POST['typeProduct']);
            $products->setStatus($_POST['status']);
            $products->setMemoty($_POST['memory']);
            $products->setDetail(isset($_POST['detail']) ? $_POST['detail'] : '');
            $products->setPrice($_POST['price']);
            $products->setCam($_POST['cam']);
            $products->setDisplay($_POST['display']);
            $products->setRam($_POST['ram']);
            $products->setColor($_POST['color']);
            

            $update = Products::update($products); 

            if($update)
            {
                header('Location: /products/manage');
            }
        }  
        View::renderTemplate('update-product.html');
    }


    public function deleteAction()
    {
        $product = new Products();
        $id = $_GET['id'];
      
            $product->setId($id);
            $delete = Products::delete($product);
            if($delete)
            {
                header('Location: /products/manage');
            }
    }

    public function fetchAction(){
        $id = $_GET['id'];
        $product = Products::findById($id);
        print_r(json_encode($product));
    }

    public function detailAction(){
        $id = $_GET['id'];
        $product = Products::findById($id);
        $product['color'] = preg_split ("/\,/", $product['color']); 
        View::renderTemplate('product-detail.html',['product'=>$product]);
    }
}