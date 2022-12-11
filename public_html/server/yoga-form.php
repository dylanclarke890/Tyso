<?php
declare(strict_types=1);
include("validation.php");
include("emums.php");

class YogaFormRecord extends Record
{
  private string $full_name;
  private string $company_name;
  private int $mats_required;
  private GoalOption $goal_of_class;
  private ClassDurationOption $class_duration;

  public function setFullName($name)
  {
    $this->full_name = $this->sanitizeString($name);
  }

  public function setCompanyName($name)
  {
    $this->company_name = $this->sanitizeString($name);
  }

  public function succeeded()
  {
    $this->validateProperties();
    return parent::succeeded();
  }

  public function getValidationResult()
  {
    $this->validateProperties();
    return parent::getValidationResult();
  }

  private function validateProperties()
  {
    if (empty($this->full_name)) {
      $this->vr->addError("Full name is required");
    }
  }
}

function numberIsWithinRange($int, $min, $max)
{
  return filter_var($int, FILTER_VALIDATE_INT, array("options" => array("min_range" => $min, "max_range" => $max)));
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
$yogaRecord = new YogaFormRecord();
$yogaRecord->setFullName($_POST['full_name']);
$yogaRecord->setCompanyName($_POST['company_name']);

echo json_encode($yogaRecord->getValidationResult());
?>