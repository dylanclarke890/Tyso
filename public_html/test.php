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
  echo '<div class="car-info" style="text-align: center">
      <p>Benz</p>
      <p>Mercedes</p>
    </div>';

  ?>

  <?php
  echo '<div class="bike-info" style="text-align: center">
    <p>Fast one</p>
    <p>Hyundai</p>
    </div>';

  $arr = array("BIke", "Car", "Truck");
  $arrAsStr = json_encode($arr);
  echo "<h2 id='test-arr'>$arrAsStr<h2>";
  ?>


  <script type="text/javascript">
  document.addEventListener("DOMContentLoaded", () => {
    const content = document.getElementById("test-arr");
    const jsonArr = content.innerText;
    const arr = JSON.parse(jsonArr);


    const newContent = document.createElement("h2");
    newContent.innerText = arr.join(" ");
    document.body.prepend(newContent);
    console.log(arr);
  })
  </script>
</body>

</html>