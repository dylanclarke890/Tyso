<?php
declare(strict_types=1);
include("enums.php");
include("validation.php");
include("config.php");

class YogaFormModel extends Model
{
  private string $full_name;
  private string $company_name;
  private int $mats_required;
  private GoalOption $goal_of_class;
  private ClassDurationOption $class_duration;

  public function __construct($data = null)
  {
    parent::__construct();
    if ($data === null)
      return;

    if (isset($data["full_name"]))
      $this->setFullName($data["full_name"]);
    if (isset($data["company_name"]))
      $this->setCompanyName($data["company_name"]);
    if (isset($data["mats_required"]))
      $this->setMatsRequired($data["mats_required"]);
    if (isset($data["goal_of_class"]))
      $this->setGoalOfClass($data["goal_of_class"]);
    if (isset($data["class_duration"]))
      $this->setClassDuration($data["class_duration"]);
  }

  public function setFullName($name)
  {
    $this->full_name = $this->sanitizeString($name);
  }

  public function setCompanyName($name)
  {
    $this->company_name = $this->sanitizeString($name);
  }

  public function setMatsRequired($mats)
  {
    $this->mats_required = $this->sanitizeInt((int) $mats);
  }

  public function setGoalOfClass($value)
  {
    $sanitized = $this->sanitizeString($value);
    $toEnum = GoalOption::tryFrom($sanitized);
    if ($toEnum !== null)
      $this->goal_of_class = $toEnum;
  }

  public function setClassDuration($value)
  {
    $sanitized = $this->sanitizeString($value);
    $toEnum = ClassDurationOption::tryFrom($sanitized);
    if ($toEnum !== null)
      $this->class_duration = $toEnum;
  }

  public function succeeded()
  {
    $this->validateModel();
    return parent::succeeded();
  }

  public function getValidationResult()
  {
    $this->validateModel();
    return parent::getValidationResult();
  }

  public function getErrors()
  {
    $this->validateModel();
    return parent::getErrors();
  }

  private function validateModel()
  {
    if (empty($this->full_name)) {
      $this->vr->addError("Full name is required.");
    } else {
      $nameLen = strlen($this->full_name);
      if ($this->numberIsWithinRange($nameLen, 1, 30) === false) {
        $this->vr->addError("Full name should be between 1 and 30 characters.");
      }
    }

    if (empty($this->company_name)) {
      $this->vr->addError("Company name is required.");
    } else {
      $nameLen = strlen($this->company_name);
      if ($this->numberIsWithinRange($nameLen, 1, 60) === false) {
        $this->vr->addError("Company name should be between 1 and 60 characters.");
      }
    }

    if (empty($this->mats_required)) {
      $this->vr->addError("Amount of mats is required.");
    } else if ($this->numberIsWithinRange($this->mats_required, 0, 20) === false) {
      $this->vr->addError("Mat amount should be less than 20.");
    }

    if (empty($this->goal_of_class)) {
      $this->vr->addError("Goal is required.");
    }

    if (empty($this->class_duration)) {
      $this->vr->addError("Duration of classes is required.");
    }
  }

  public function exitIfError(bool $overrideCheck = false)
  {
    if ($overrideCheck || $this->succeeded())
      return;
    echo json_encode($this->getValidationResult());
    exit();
  }
}

$yogaRecord = new YogaFormModel($_POST);
$yogaRecord->exitIfError();

try {
  $conn = new PDO("mysql:host=$hostname;dbname=$dbname", $username, $password);
  // set the PDO error mode to exception
  $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
  $yogaRecord->vr->addError("Connection failed: " . $e->getMessage());
}

$yogaRecord->exitIfError(overrideCheck: true);
?>