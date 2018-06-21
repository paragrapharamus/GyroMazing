#ifndef DEF_SENSOR
#define DEF_SENSOR

#include <stdint.h>

extern int fd;

void init_gyro(void);
int8_t get_gyro_x(void);
int8_t get_gyro_y(void);
double get_angle_x(void);
double get_angle_y(void);

#endif
