<?php

namespace App\Controllers;
use \Core\View;
use \App\Models\Users;
use mysqli;

class LoginController extends \Core\Controller
{
    public function SigninAction()
    {
        $users = new Users();
        if(isset($_POST['submit']))
        {
            $users->setEmail($_POST['email']);
            $password_input = $_POST['pwd'];
            $result = Users::login($users);
            if(mysqli_num_rows($result))
            {
                while($row = mysqli_fetch_all($result))
                {
                    $users->id = $row["id"];
                    $users->email = $row["email"];
                    $users->password = $row["password"];
                }
                if(password_verify($password_input, $users->password))
                {
                    $_SESSION['id'] = $users->id;
                    View::renderTemplate('manage.blade.html');
                }
            }
        }
        View::renderTemplate('login.blade.html');
    }
}