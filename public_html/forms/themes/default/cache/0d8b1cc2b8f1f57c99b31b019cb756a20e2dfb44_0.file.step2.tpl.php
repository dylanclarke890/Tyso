<?php
/* Smarty version 3.1.31, created on 2019-04-03 21:27:44
  from "/home/sites/1a/7/7f76a77624/public_html/forms/install/templates/step2.tpl" */

/* @var Smarty_Internal_Template $_smarty_tpl */
if ($_smarty_tpl->_decodeProperties($_smarty_tpl, array (
  'version' => '3.1.31',
  'unifunc' => 'content_5ca517402f7069_43458422',
  'has_nocache_code' => false,
  'file_dependency' => 
  array (
    '0d8b1cc2b8f1f57c99b31b019cb756a20e2dfb44' => 
    array (
      0 => '/home/sites/1a/7/7f76a77624/public_html/forms/install/templates/step2.tpl',
      1 => 1537241520,
      2 => 'file',
    ),
  ),
  'includes' => 
  array (
    'file:../../install/templates/install_header.tpl' => 1,
    'file:../../install/templates/install_footer.tpl' => 1,
  ),
),false)) {
function content_5ca517402f7069_43458422 (Smarty_Internal_Template $_smarty_tpl) {
$_smarty_tpl->_subTemplateRender("file:../../install/templates/install_header.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array(), 0, false);
?>


<h2><?php echo $_smarty_tpl->tpl_vars['LANG']->value['phrase_system_check'];?>
</h2>

<p>
	<?php echo $_smarty_tpl->tpl_vars['LANG']->value['text_install_system_check'];?>

</p>

<table cellspacing="0" cellpadding="2" width="600" class="info">
	<tr>
		<td width="220"><?php echo $_smarty_tpl->tpl_vars['LANG']->value['phrase_php_version'];?>
</td>
		<td class="bold"><?php echo $_smarty_tpl->tpl_vars['phpversion']->value;?>
</td>
		<td width="100" align="center">
			<?php if ($_smarty_tpl->tpl_vars['valid_php_version']->value) {?>
				<span class="green"><?php echo mb_strtoupper($_smarty_tpl->tpl_vars['LANG']->value['word_pass'], 'UTF-8');?>
</span>
			<?php } else { ?>
				<span class="red"><?php echo mb_strtoupper($_smarty_tpl->tpl_vars['LANG']->value['word_fail'], 'UTF-8');?>
</span>
			<?php }?>
		</td>
	</tr>
	<tr>
		<td valign="top">PDO available</td>
		<td valign="top" class="bold">
            <?php if ($_smarty_tpl->tpl_vars['pdo_available']->value) {?>
				<?php echo $_smarty_tpl->tpl_vars['LANG']->value['word_yes'];?>

			<?php } else { ?>
                <?php echo $_smarty_tpl->tpl_vars['LANG']->value['word_no'];?>

			<?php }?>
		</td>
		<td valign="top" align="center">
            <?php if ($_smarty_tpl->tpl_vars['pdo_available']->value) {?>
				<span class="green"><?php echo mb_strtoupper($_smarty_tpl->tpl_vars['LANG']->value['word_pass'], 'UTF-8');?>
</span>
            <?php } else { ?>
				<span class="red"><?php echo mb_strtoupper($_smarty_tpl->tpl_vars['LANG']->value['word_fail'], 'UTF-8');?>
</span>
            <?php }?>
		</td>
	</tr>
	<tr>
		<td valign="top">MySQL available</td>
		<td valign="top" class="bold"><?php echo $_smarty_tpl->tpl_vars['LANG']->value['word_yes'];?>
</td>
		<td valign="top" align="center">
            <?php if ($_smarty_tpl->tpl_vars['pdo_mysql_available']->value) {?>
				<span class="green"><?php echo mb_strtoupper($_smarty_tpl->tpl_vars['LANG']->value['word_pass'], 'UTF-8');?>
</span>
			<?php } else { ?>
				<span class="red"><?php echo mb_strtoupper($_smarty_tpl->tpl_vars['LANG']->value['word_fail'], 'UTF-8');?>
</span>
			<?php }?>
		</td>
	</tr>
	<tr>
		<td>PHP Sessions</td>
		<td class="bold">
			<?php if ($_smarty_tpl->tpl_vars['sessions_loaded']->value == 1) {?>
				Available
			<?php } else { ?>
				Not Available
			<?php }?>
		</td>
		<td width="100" align="center">
			<?php if ($_smarty_tpl->tpl_vars['sessions_loaded']->value == 1) {?>
				<span class="green"><?php echo mb_strtoupper($_smarty_tpl->tpl_vars['LANG']->value['word_pass'], 'UTF-8');?>
</span>
			<?php } else { ?>
				<span class="red"><?php echo mb_strtoupper($_smarty_tpl->tpl_vars['LANG']->value['word_fail'], 'UTF-8');?>
</span>
			<?php }?>
		</td>
	</tr>
	<tr>
		<td rowspan="2" valign="top"><?php echo $_smarty_tpl->tpl_vars['LANG']->value['phrase_write_permissions'];?>
</td>
		<td class="bold">
			/upload/
		</td>
		<td align="center">
			<?php if ($_smarty_tpl->tpl_vars['upload_folder_writable']->value) {?>
				<span class="green"><?php echo mb_strtoupper($_smarty_tpl->tpl_vars['LANG']->value['word_pass'], 'UTF-8');?>
</span>
			<?php } else { ?>
				<span class="red"><?php echo mb_strtoupper($_smarty_tpl->tpl_vars['LANG']->value['word_fail'], 'UTF-8');?>
</span>
			<?php }?>
		</td>
	</tr>
	<tr>
		<td class="bold">
			/themes/<?php echo $_smarty_tpl->tpl_vars['g_default_theme']->value;?>
/cache/
		</td>
		<td align="center">
			<?php if ($_smarty_tpl->tpl_vars['default_theme_cache_dir_writable']->value) {?>
				<span class="green"><?php echo mb_strtoupper($_smarty_tpl->tpl_vars['LANG']->value['word_pass'], 'UTF-8');?>
</span>
			<?php } else { ?>
				<span class="red"><?php echo mb_strtoupper($_smarty_tpl->tpl_vars['LANG']->value['word_fail'], 'UTF-8');?>
</span>
			<?php }?>
		</td>
	</tr>
</table>

<?php if (!$_smarty_tpl->tpl_vars['valid_php_version']->value || !$_smarty_tpl->tpl_vars['pdo_available']->value || !$_smarty_tpl->tpl_vars['pdo_mysql_available']->value || !$_smarty_tpl->tpl_vars['sessions_loaded']->value) {?>

	<p class="error" style="padding: 6px">
		<?php echo $_smarty_tpl->tpl_vars['LANG']->value['text_install_form_tools_server_not_supported'];?>

	</p>

<?php } elseif (!$_smarty_tpl->tpl_vars['upload_folder_writable']->value || !$_smarty_tpl->tpl_vars['default_theme_cache_dir_writable']->value) {?>

	<p class="error" style="padding: 6px">
        Please ensure the required folders have write permissions. See the
		<a href="https://docs.formtools.org/installation/step2/">help documentation</a> for further information.
	</p>

<?php } else { ?>

	<form action="step3.php" method="post">

		<?php if ($_smarty_tpl->tpl_vars['suhosin_loaded']->value) {?>
			<div class="warning">
				<?php echo $_smarty_tpl->tpl_vars['LANG']->value['notify_suhosin_installed'];?>

			</div>
		<?php }?>

		<div id="continue_block">
			<p>
				<input type="submit" name="next" value="<?php echo $_smarty_tpl->tpl_vars['LANG']->value['word_continue_rightarrow'];?>
" />
			</p>
		</div>

	</form>
<?php }?>

<?php $_smarty_tpl->_subTemplateRender("file:../../install/templates/install_footer.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array(), 0, false);
?>

<?php }
}
