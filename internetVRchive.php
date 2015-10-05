<?php

class Component_internetVRchive extends Component {
  public function init() {
    OrmManager::LoadModel("internetVRchive");
  }

  public function controller_internetVRchive($args) {
    $vars = array();
    return $this->GetComponentResponse("./internetVRchive.tpl", $vars);
  }
}  
