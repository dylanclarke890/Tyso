<!DOCTYPE html>
<!--[if lte IE 7 ]><html lang="en" class="ie7"><![endif]-->
<!--[if IE 8 ]><html lang="en" class="ie8"><![endif]-->
<!--[if (gt IE 8)|!(IE)]><!-->
<html lang="en">
	<!--<![endif]-->
    <head>
    	<meta charset="utf-8" />
        <title>Remote TYSO</title>
        <link href="frank.css" rel="stylesheet" type="text/css" />
        <!--<link href="example.css" rel="stylesheet" type="text/css" />-->
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />

        
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
		<script></script>
        
        <style>
		
		
		@media screen and (max-width: 767px){
		
		} 
			
		@media all and (orientation:landscape){}
		
		@media screen and (min-width: 768px){
		body
		{
			
		}
		
		}
		</style>
    </head>
    <body>
    	<header class="main">
        	<h1>My Contact Form</h1>
    	</header>
    	<section class="main">
        	<?php
        		$name = $_POST['name'];
        		$email = $_POST['email'];
        		$message = $_POST['message'];
        		$from = 'From: My Contact Form';
        		$to = 'SoCherryWebDev@outlook.com';
        		$subject = 'TEST?';

        		$body = "From: $name\n E-Mail: $email\n Message:\n $message";

       			if ($_POST['submit']) {
        			if (mail ($to, $subject, $body, $from)) {
            		echo '<p>Message Sent Successfully!</p>';
            		} else {
            		echo '<p>Ah! Try again, please?</p>';
            		}
       			}
    		?>
        	<form method="post" action="index.php">
            	<label>Your Name:</label>
               		<input name="name" placeholder="Goes Here">
                
               	<label>Your Email:</label>
               		<input name="email" type="email" placeholder="Goes Here">
                
               	<label>Your Message:</label>
               		<textarea name="message" placeholder="Goes Here"></textarea>
                
               	<input id="submit" name="submit" type="submit" value="Submit">
			</form>
    	</section>
    	 <script>
        
        </script>
    </body>
</html>
