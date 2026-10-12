<?php 
    include_once __DIR__ . '/header-dashboard.php';
?>

    <div class="contenedor-sm">
        <div class="contenedor-nueva-tarea">
            <button
                type="button"
                class="agregar-tarea"
                id="agregar-tarea"
            >&#43; Nueva Tarea</button> <!--eso de ahí resulta una entidad para que salga un símbolo de +, se pueden sacar de internete-->
        </div>

        <div id="filtros" class="filtros">
            <div class="filtros-inputs"> <!--se usa un div y no un form porque no va a resultar un formulario de registro-->
                <h2>Filtros</h2>
                <div class="campo">
                    <label for="todas">Todas</label>
                    <input
                        type="radio"
                        id="todas"
                        name="filtro"
                        value=""
                        checked
                    /> <!--todas tienen que tener en mismo name y sólo puede haber una como checked-->
                </div>

                <div class="campo">
                    <label for="completadas">Completadas</label>
                    <input
                        type="radio"
                        id="completadas"
                        name="filtro"
                        value="1"
                    />
                </div>

                <div class="campo">
                    <label for="pendientes">Pendientes</label>
                    <input
                        type="radio"
                        id="pendientes"
                        name="filtro"
                        value="0"
                    />
                </div>
            </div>
        </div>

        <ul id="listado-tareas" class="listado-tareas"></ul>
    </div>

<?php 
    include_once __DIR__ . '/footer-dashboard.php';
?>

<?php
$cript .= '
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script src=build/js/tareas.js"></script>
';
?>