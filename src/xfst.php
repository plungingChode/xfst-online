<?php 
    if (isset($_REQUEST["download-text"])) {
        $tempName = tempnam(sys_get_temp_dir(), 'script');
        $file = fopen($tmpName, 'w');

        fputs($_POST["download-text"]);
        fclose($file);

        header("Content-Description: File Transfer");
        header("Content-Type: text/plain");
        header("Content-Disposition: attachment; filename=script.xfst");
        header("Content-Transfer-Encoding: binary");
        header("Expires: 0");
        header("Cache-Control: must-revalidate");
        header("Pragma: public");
        header("Content-Length: ".filesize($tmpName));

        ob_clean();
        flush();
        readfile($tmpName);
        unlink($tmpName);
    }
    else if (isset($_POST["input"])) {
        setlocale(LC_CTYPE, "hu_HU.UTF-8");    

        $input = escapeshellarg($_POST["input"]);
        $quiet = isset($_POST["quiet"]) ? "-q" : "";
    
        $output = shell_exec("echo -e ".$input." | ./xfst ".$quiet." 2>&1");
        echo $output;
    }
?>
