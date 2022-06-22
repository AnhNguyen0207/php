<?php

namespace App\Controllers;
use \App\Models\Products;
use Core\View;

 class HomeController extends \Core\Controller{
    public function indexAction()
        {
            $products = Products::getAllPublished();
            View::renderTemplate('welcome.blade.html',
                    ['products'=>$products]);
        }
    
 }
 