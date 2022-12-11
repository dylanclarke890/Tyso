<?php
declare(strict_types=1);
include("config.php");
include("enums.php");
include("validation.php");

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

  public function getFullName()
  {
    return $this->full_name;
  }

  public function setCompanyName($name)
  {
    $this->company_name = $this->sanitizeString($name);
  }

  public function getCompanyName()
  {
    return $this->company_name;
  }

  public function setMatsRequired($mats)
  {
    $this->mats_required = $this->sanitizeInt((int) $mats);
  }

  public function getMatsRequired()
  {
    return $this->mats_required;
  }

  public function setGoalOfClass($value)
  {
    $sanitized = $this->sanitizeString($value);
    $toEnum = GoalOption::tryFrom($sanitized);
    if ($toEnum !== null)
      $this->goal_of_class = $toEnum;
  }

  public function getGoalOfClass()
  {
    return $this->goal_of_class;
  }

  public function setClassDuration($value)
  {
    $sanitized = $this->sanitizeString($value);
    $toEnum = ClassDurationOption::tryFrom($sanitized);
    if ($toEnum !== null)
      $this->class_duration = $toEnum;
  }

  public function getClassDuration()
  {
    return $this->class_duration;
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
    if (!$overrideCheck && $this->succeeded())
      return;
    echo json_encode($this->getValidationResult());
    exit();
  }
}

$record = new YogaFormModel($_POST);
$record->exitIfError();

try {
  $conn = new PDO("mysql:host=$hostname;dbname=$dbname", $username, $password);
  $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

  $create = "CREATE TABLE IF NOT EXISTS YogaSurveyResponse (
    id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(30) NOT NULL,
    company_name VARCHAR(60) NOT NULL,
    mats_required VARCHAR(6) NOT NULL,
    goal_of_class VARCHAR(30) NOT NULL,
    class_duration VARCHAR(30) NOT NULL
    )";

  $conn->exec($create);

  $insert = "INSERT INTO YogaSurveyResponse (
    full_name, company_name, mats_required, goal_of_class, class_duration
    )
  VALUES (
    '{$record->getFullName()}', '{$record->getCompanyName()}', {$record->getMatsRequired()},
    '{$record->getGoalOfClass()->value}', '{$record->getClassDuration()->value}'
    )";

  $conn->exec($insert);

} catch (PDOException $e) {
  $record->vr->addError("Database Error: " . $e->getMessage());
}

$record->exitIfError(overrideCheck: true);
?>