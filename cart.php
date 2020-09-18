<?php 
    if (isset($_POST['name'])&&isset($_POST['surname'])&&isset($_POST['address'])&&isset($_POST['pokemonID'])){
        $cart->name = $_POST['name'];
        $cart->surname = $_POST['surname'];
        $cart->address = $_POST['address'];
        $cart->pokemon = $_POST['pokemonID'];

        $json = json_encode($cart);
        echo $json;

        $fp = fopen('cart.json', 'w');
        fwrite($fp, json_encode($cart));
        fclose($fp);

        //Operacije nad bazom
        include "db_connection.php";
        $sql="INSERT INTO cart (NAME, SURNAME, ADDRESS, POKEMON_ID) VALUES ('".$cart->name."', '".$cart->surname."', '".$cart->address."', '".$cart->pokemon."')";

        if (mysqli_query($db, $sql)){
            echo "done";
        } else {
            echo "fail" . mysql_error();
        }
    } else {
    //Ako POST parametri nisu prosleđeni
        echo "Nisu prosleđeni parametri!";
    }
    mysqli_close($db);

    /*foreach($_POST as $post_var){
        echo strtoupper($post_var) . "<br />";
    }*/
?>