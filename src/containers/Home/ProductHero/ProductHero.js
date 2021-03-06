import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Link from '@material-ui/core/Link';
import ProductHeroLayout from "./ProductHeroLayout/ProductHeroLayout";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import hero from './hero.png'
import styled from "styled-components";
import DescriptionIcon from "@material-ui/icons/Description"

const styles = theme => ({
  background: {
    backgroundImage: `url(${hero})`,
    backgroundPosition: 'center',
  },
  button: {
    marginTop: theme.spacing.unit * 6,
    minWidth: 200,
    fontSize: '1.2em',
    "&:hover": {
      cursor: "pointer"
    }
  },
  h2: {
    marginTop: theme.spacing.unit * 4,
    fontWeight: 500
  },
  h5: {
    marginBottom: theme.spacing.unit * 4,
    marginTop: theme.spacing.unit * 3,
    [theme.breakpoints.up('sm')]: {
      marginTop: theme.spacing.unit * 10,
    },
    fontWeight: 500
  },
  link: {
    marginTop: theme.spacing.unit * 4,
    color: 'white',
  },
  subtitle1: {
    color: 'white',
    fontWeight: 500,
    textDecoration: 'underline',
    fontSize: '1.2em',
    display: 'inline-block',
    verticalAlign: 'bottom',
    marginLeft: '5px'
  },
});


// 何故かTypographyまでPrimary colorになってしまうバグのWorkaround
// Editorがマウントするときに何かやらかしてるっぽいが・・・？
const StyledButton = styled(Button)`
  color: black!important;
`


function ProductHero(props) {
  const {classes} = props;

  return (
    <ProductHeroLayout backgroundClassName={classes.background}>
      {/* Increase the network loading priority of the background image. */}
      <img style={{display: 'none'}} src={hero} alt=""/>
      <Typography color="inherit" align="center" variant="h2" marked="center" className={classes.h2}>
        Railroad Editor
      </Typography>
      <Typography color="inherit" align="center" variant="h5" className={classes.h5}>
        The free, modern model railway design tool.
      </Typography>
      <StyledButton
        color="primary"
        variant="contained"
        size="large"
        className={classes.button}
        component={linkProps => (
          <Link {...linkProps} href="/editor" variant="button"/>
        )}
        disableRipple={true}
      >
        Launch Railroad Editor
      </StyledButton>

      <Link target="_blank"
            href="http://d2t6ssvra5p03o.cloudfront.net/index.html"
            className={classes.link}
      >
        <DescriptionIcon/>
        <Typography variant="subtitle1" className={classes.subtitle1}>
          User Manual
        </Typography>
      </Link>
    </ProductHeroLayout>
  );
}

ProductHero.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ProductHero);
