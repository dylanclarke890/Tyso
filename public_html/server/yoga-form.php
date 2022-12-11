<?php
declare(strict_types=1);
include("validation.php");
include("emums.php");

class YogaFormRecord extends Record
{
  public string $full_name;
  public string $company_name;
  public int $mats_required;
  public GoalOption $goal_of_class;
  public ClassDurationOption $class_duration;
}

function numberIsWithinRange($int, $min, $max)
{
  return filter_var($int, FILTER_VALIDATE_INT, array("options" => array("min_range" => $min, "max_range" => $max)));
}

function filterPost($input)
{
  $safePost = filter_input_array($input, [
    "id" => FILTER_VALIDATE_INT,
    "name" => FILTER_SANITIZE_STRING,
    "email" => FILTER_SANITIZE_EMAIL
  ]);
}

function validateInput()
{
  $validation = new ValidationResult();

  if (empty($_POST["full_name"])) {
    $validation->addError("Full name is required.");
  } else {
    $name = $_POST["full_name"];
    $nameLen = strlen($name);
    if (numberIsWithinRange($nameLen, 1, 30) === false) {
      $validation->addError("Full name should be between 1 and 30 characters.");
    }
  }

  if (empty($_POST["company_name"])) {
    $validation->addError("Company name is required.");
  } else {
    $name = $_POST["company_name"];
    $nameLen = strlen($name);
    if (numberIsWithinRange($nameLen, 1, 60) === false) {
      $validation->addError("Company name should be between 1 and 60 characters.");
    }
  }

  if (empty($_POST["mats_required"])) {
    $validation->addError("Amount of mats is required.");
  } else {
    $matsRequired = $_POST["mats_required"];
    if (numberIsWithinRange($matsRequired, 0, 20) === false) {
      $validation->addError("Mat amount should be less than 20.");
    }
  }

  if (empty($_POST['goal_of_class'])) {
    $validation->addError("Goal is required.");
  } else {
    $duration = $_POST['goal_of_class'];
    $valToEnum = GoalOption::tryFrom($duration);
    if (empty($valToEnum))
      $validation->addError("$duration is not a valid goal.");
  }

  if (empty($_POST["class_duration"])) {
    $validation->addError("Duration of classes is required.");
  } else {
    $duration = $_POST['class_duration'];
    $valToEnum = ClassDurationOption::tryFrom($duration);
    if (empty($valToEnum))
      $validation->addError("$duration is not a valid goal.");
  }

  return $validation;
}

$validation = validateInput();

echo json_encode($validation->getResult());
?>