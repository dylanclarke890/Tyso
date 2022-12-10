<?php
declare(strict_types=1);

class ValidationResult implements JsonSerializable
{
  public array $errors = array();
  public function success()
  {
    return count($this->errors) === 0;
  }

  /**
   * Specify data which should be serialized to JSON
   * Serializes the object to a value that can be serialized natively by json_encode().
   * @return mixed Returns data which can be serialized by json_encode(), which is a value of any type other than a resource .
   */
  public function jsonSerialize(): mixed
  {
    $vars = get_object_vars($this);
    return $vars;
    // if ($this->success())
    // return true;
    // else
    // return $this->errors;
  }
}
?>