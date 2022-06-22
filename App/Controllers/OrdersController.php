<?php
namespace App\Controllers;
use  Core\View;
use  App\Models\Orders;
class OrdersController extends \Core\Controller
{
    public function createAction()
    {
        $orders = new Orders();
        if (isset($_POST['submit'])){
            $orders->setPhone($_POST['phone']);
            $orders->setName($_POST['name']);
            $orders->setAddress($_POST['address']);
            $orders->setStatus($_POST['status']);
            $orders->setProduct_id($_POST['product_id']);
            $orders->setPrice($_POST['price']);
            $orders->setNumb($_POST['numb']);
            
            $create = Orders::create($orders);
            if($create)
            {
                $_SESSION["alert"] = 'success';
                header('Location: /');
            }
        }
            View::renderTemplate('checkout.html');
    }
}