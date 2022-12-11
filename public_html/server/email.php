<?php

include("validation.php");

class EmailModel extends Model
{
  private string $name;
  private string $email;
  private string $subject;
  private string $message;

  public function __construct($data)
  {
    parent::__construct();
    if ($data === null)
      return;

    if (isset($data["name"]))
      $this->setName($data["name"]);
    if (isset($data["email"]))
      $this->setEmail($data["email"]);
    if (isset($data["subject"]))
      $this->setSubject($data["subject"]);
    if (isset($data["message"]))
      $this->setMessage($data["message"]);
  }

  public function getName()
  {
    return $this->name;
  }

  public function setName($value)
  {
    $this->name = $this->sanitizeString($value);
  }

  public function getEmail()
  {
    return $this->email;
  }

  public function setEmail($value)
  {
    $this->email = filter_var($value, FILTER_SANITIZE_EMAIL);
  }

  public function getSubject()
  {
    return $this->subject;
  }

  public function setSubject($value)
  {
    $this->subject = $this->sanitizeString($value);
  }

  public function getMessage()
  {
    return $this->message;
  }

  public function setMessage($value)
  {
    $this->message = $this->sanitizeString($value);
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
    if (empty($this->name)) {
      $this->vr->addError("Name is required.");
    } else {
      $nameLen = strlen($this->name);
      if ($this->numberIsWithinRange($nameLen, 1, 30) === false) {
        $this->vr->addError("Name should be between 1 and 30 characters.");
      }
    }

    if (empty($this->email)) {
      $this->vr->addError("Email is required.");
    }

    if (empty($this->subject)) {
      $this->vr->addError("Subject is required.");
    }
  }

  public function exitIfError(bool $overrideCheck = false)
  {
    if (!$overrideCheck && $this->succeeded())
      return;
    echo json_encode($this->getValidationResult());
    exit();
  }

  public function send()
  {
    if (!$this->succeeded()) {
      $this->vr->addError("Model in invalid state to send.");
      return;
    }

    try {
      mail($this->email, "From {$this->name}: {$this->subject}", $this->message);
    } catch (Exception $e) {
      $this->vr->addError("Error sending email: " . $e->getMessage());
    }
  }
}

$record = new EmailModel($_POST);
$record->exitIfError();
$record->send();
$record->exitIfError(overrideCheck: true);
?>