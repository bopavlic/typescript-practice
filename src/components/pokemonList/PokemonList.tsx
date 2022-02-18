import { useState, useEffect } from 'react';
import { fetchPokemons } from '../../services/pokemon/api';
import { Pokemon, PokemonListProps } from './types';
import {
  Box,
  CircularProgress,
  Pagination,
  Paper,
  Typography,
} from '@mui/material';
import { usePokemonListStyles } from './styled';
import { capitalizeFirstLetter } from '../../services/helpers/capitalizeFirstLetter';

const PokemonList: React.FC<PokemonListProps> = (props) => {
  const { darkMode } = props;
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [pageNumber, setPageNumber] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const classes = usePokemonListStyles();

  const handlePageChange = async (
    event: React.ChangeEvent<any>,
    value: number
  ) => {
    event.preventDefault();
    //page 1 is default one that loads
    if (value === 1) {
      setPageNumber(0);
    } else {
      setPageNumber(value);
    }
  };

  const handlePokemonId = (url: string) => {
    const splitted = url.split('/');
    const id = splitted[splitted.length - 2];
    return id;
  };

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const result = await fetchPokemons(pageNumber * 20); //20 pokemons per page
        setPokemonList(result.pokemons);
      } catch (error) {
        console.error(error);
      }
      setIsLoading(false);
    })();
  }, [pageNumber]);

  return (
    <Box className={classes.pokemonList}>
      <Typography sx={{ textAlign: 'center', padding: '1rem' }} variant='h4'>
        Pokemon list
      </Typography>
      <Box className={classes.pokemonList__inner}>
        {/* -- showing fetched pokemons */}
        {!isLoading ? (
          pokemonList?.map((pokemon: Pokemon, index: number) => (
            <Paper
              key={index}
              className={classes.paper}
              elevation={darkMode ? 16 : 4}
            >
              <Typography variant='h5'>
                {capitalizeFirstLetter(pokemon.name)}
              </Typography>
              <Typography variant='h6'>
                id: {handlePokemonId(pokemon.url)}
              </Typography>
            </Paper>
          ))
        ) : (
          //show and center spinner while loading
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
          </Box>
        )}
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
        <Pagination
          onChange={handlePageChange}
          page={pageNumber}
          count={56}
          size='large'
        />
      </Box>
    </Box>
  );
};

export default PokemonList;
