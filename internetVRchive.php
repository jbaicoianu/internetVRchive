<?php

class Component_internetVRchive extends Component {
  public function init() {
    OrmManager::LoadModel("internetVRchive");
  }

  public function controller_internetVRchive($args) {
    $vars = array();
    return $this->GetComponentResponse("./internetVRchive.tpl", $vars);
  }
  public function controller_cors($args) {
    $url = $args["url"];
    $contents = file_get_contents($url);
    $file_info = new finfo(FILEINFO_MIME_TYPE);
    $mime_type = $file_info->buffer($contents);

    header('Content-Type: $mime_type');
    return $contents;
  }
}  
