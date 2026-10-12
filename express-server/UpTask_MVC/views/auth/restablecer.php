<div class="contenedor restablecer">
    <?php
        include_once __DIR__ . '/../templates/nombre-sitio.php';
    ?>

    <div class="contenedor-sm">
        <p class="descripcion-pagina">Coloca tu Nuevo Password</p>

        <?php
            include_once __DIR__ . '/../templates/alertas.php';
        ?>

        <?php if($mostrar) { ?>

        <form class="formulario" method="POST"> <!--sin action para que no se pierda el token-->
            <div class="campo">
                <label for="password">Password</label>

                <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="Tu Password"
                />
            </div>

            <input type="submit" class="boton" value="Guardar Password">
        </form>

        <?php } ?>

        <div class="acciones">
            <a class="" href="/crear">¿Aún no tienes una cuenta? Obtener una</a>
            <a class="" href="/olvide">¿Olvidaste tu password? Recupéralo</a>
        </div>
    </div> <!--Contenedor sm-->
</div>