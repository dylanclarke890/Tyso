<?php
declare(strict_types=1);
enum GoalOption:string
{
  case Balance = "Balance";
  case Force = "Force";
  case Concentration = "Concentration";
  case Conscience = "Conscience";
  case TeamBuilding = "TeamBuilding";
  case Leadership = "Leadership";
  case YogaIntro = "YogaIntro";
  case MeditationIntro = "MeditationIntro";
}

enum ClassDurationOption:string
{
  case One = "One";
  case Five = "Five";
  case Ten = "Ten";
  case Twenty = "Twenty";
}
?>