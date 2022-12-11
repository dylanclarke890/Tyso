<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>TEST DOC</title>
</head>

<body>
  <?php

  $bikeHTML = '<div class="bike-info" style="text-align: center">
        <p>Fast one</p>
        <p>Hyundai</p>
        </div>';
  $carHTML = '<div class="car-info" style="text-align: center">
          <p>Benz</p>
          <p>Mercedes</p>
        </div>';

  $type = $_GET["type"];

  if (isset($type)) {
    if ($type === "Bike") {
      echo $bikeHTML;
    } else if ($type === "Car") {
      echo $carHTML;
    }
  } else {
    echo $bikeHTML;
    echo $carHTML;
  }
  ?>
</body>

</html>