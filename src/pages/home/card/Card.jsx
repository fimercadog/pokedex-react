import React, { useEffect, useState } from "react";
import css from "./card.module.scss";
import {
  URL_ESPECIES,
  URL_EVOLUIONES,
  URL_POKEMON,
} from "../../../api/apiRest";
import axios from "axios";

export default function Card({ card }) {
  const [itemPokemon, setItemPokemon] = useState({});
  const [especiePokemon, setEspeciePokemon] = useState({});
  const [evolcionesPokemon, setEvolcionesPokemon] = useState([]);

  useEffect(() => {
    const dataPokemon = async () => {
      const api = await axios.get(`${URL_POKEMON}/${card.name}`);
      setItemPokemon(api.data);
    };
    dataPokemon();
  }, [card]);

  useEffect(() => {
    const dataEspecie = async () => {
      const URL = card.url.split("/");
      const api = await axios.get(`${URL_ESPECIES}/${URL[6]}`);
      setEspeciePokemon({
        url_especie: api?.data?.evolution_chain,
        data: api?.data,
      });
    };
    dataEspecie();
  }, [card]);

  useEffect(() => {
    async function getPokemonImage(id) {
      const response = await axios.get(`${URL_POKEMON}/${id}`);
      return response?.data?.sprites?.other["official-artwork"]?.front_default;
    }

    if (especiePokemon?.url_especie) {
      const obtenerEvolucines = async () => {
        const arrayEvoluciones = [];

        const URL = especiePokemon?.url_especie?.url?.split("/");
        const api = await axios.get(`${URL_EVOLUIONES}/${URL[6]}`);

        // Verificamos si la cadena de evolución existe
        const species = api?.data?.chain?.species;
        if (species) {
          const URL2 = species?.url?.split("/");
          const img1 = await getPokemonImage(URL2[6]);
          arrayEvoluciones.push({
            img: img1,
            name: species?.name,
          });
        }

        // Verificamos si 'evolves_to' tiene elementos antes de acceder
        if (api?.data?.chain?.evolves_to?.length > 0) {
          const DATA2 = api?.data?.chain?.evolves_to[0]?.species;
          if (DATA2?.url) {
            const ID = DATA2?.url.split("/");
            const img2 = await getPokemonImage(ID[6]);

            arrayEvoluciones.push({
              img: img2,
              name: DATA2?.name,
            });
          }
        }

        // Verificamos si 'evolves_to' tiene elementos antes de acceder
        if (api?.data?.chain?.evolves_to[0]?.evolves_to?.length > 0) {
          const DATA3 = api?.data?.chain?.evolves_to[0]?.evolves_to[0]?.species;
          if (DATA3?.url) {
            const ID = DATA3?.url.split("/");
            const img3 = await getPokemonImage(ID[6]);

            arrayEvoluciones.push({
              img: img3,
              name: DATA3?.name,
            });
          }
        }

        // Después de obtener las evoluciones, actualizamos el estado
        setEvolcionesPokemon(arrayEvoluciones);
      };

      // Llamamos a la función para obtener las evoluciones
      obtenerEvolucines();
    }
  }, [especiePokemon]);

  // Formatea el ID del Pokémon para que siempre tenga 3 dígitos
  let pokeId = itemPokemon?.id?.toString();
  if (pokeId?.length === 1) {
    pokeId = "00" + pokeId; // Si el ID tiene un solo dígito, agrega dos ceros al inicio
  } else if (pokeId?.length === 2) {
    pokeId = "0" + pokeId; // Si el ID tiene dos dígitos, agrega un cero al inicio
  }

  return (
    <div className={css.card}>
      {/* Imagen del Pokémon */}
      <img
        src={itemPokemon?.sprites?.other["official-artwork"]?.front_default}
        alt="pokemon"
        className={css.img_poke}
      />

      {/* Contenedor principal de la tarjeta */}
      <div className={`bg-${especiePokemon?.data?.color?.name} ${css.sub_card}`}>
        {/* Información básica */}
        <strong className={css.id_card}>#{pokeId}</strong>
        <strong className={css.name_card}>{itemPokemon.name}</strong>
        <h4 className={css.altura_poke}>Altura: {itemPokemon.height}0 cm</h4>
        <h4 className={css.peso_poke}>Peso: {itemPokemon.weight} Kg</h4>
        <h4 className={css.habitat_poke}>Habitat: {especiePokemon?.data?.habitat?.name}</h4>

        {/* Estadísticas del Pokémon */}
        <div className={css.div_stats}>
          {itemPokemon?.stats?.map((sta, index) => {
            return (
              <h6 key={index} className={css.item_stats}>
                <span className={css.name}>{sta.stat.name}</span>
                <progress value={sta.base_stat} max={110}></progress>
                <span className={css.numero}>{sta.base_stat}</span>
              </h6>
            )
          })}
        </div>

        {/* Tipos del Pokémon */}
        <div className={css.div_type_color}>
          {itemPokemon?.types?.map((ti, index) => {
            return (
              <h6
                className={`color-${ti.type.name} ${css.color_type}`}
                key={index}
              >
                {ti.type.name}
              </h6>
            )
          })}
        </div>

        {/* Evoluciones del Pokémon */}
        <div className={css.div_evolucion}>
          {evolcionesPokemon.map((evo, index) => {
            return (
              <div className={css.item_evo} key={index}>
                <img src={evo.img} alt={evo.name} className={css.img} />
                <h6>{evo.name}</h6>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  );

}
