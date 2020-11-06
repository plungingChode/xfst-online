<?php 
    $input = escapeshellarg($_POST["input"]);
    $quiet = isset($_POST["quiet"]) ? "-q" : "";

    $output = shell_exec("echo -e ".$input." | ./xfst ".$quiet." 2>&1");
    echo $output;
?>