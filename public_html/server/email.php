<?php

include("validation.php");

class EmailModel extends Model
{
  private string $email;
  private string $subject;
  private string $message;

  public function __construct($email, $subject, $message)
  {
    $this->email = $email;
    $this->subject = $subject;
    $this->message = $message;
  }

  public function getEmail()
  {
    return $this->email;
  }
  public function setEmail()
  {
  }
  public function getSubject()
  {
    return $this->subject;
  }
  public function setSubject()
  {
  }
  public function getMessage()
  {
    return $this->message;
  }
  public function setMessage()
  {
  }
}

?>