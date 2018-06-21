#include <stdint.h>
#include <wiringPi.h>
#include <wiringPiI2C.h>
#include "libSensor.h"
#include <stdio.h>
#include <math.h>

#define MPU6050_GYRO_XOUT_H        0x43   // R
#define MPU6050_GYRO_YOUT_H        0x45   // R
#define MPU6050_GYRO_ZOUT_H        0x47   // R

#define MPU6050_ACCEL_XOUT_H       0x3B   // R
#define MPU6050_ACCEL_YOUT_H       0x3D   // R
#define MPU6050_ACCEL_ZOUT_H       0x3F   // R

#define MPU6050_PWR_MGMT_1         0x6B   // R/W
#define MPU6050_I2C_ADDRESS        0x68   // I2C

int fd;

void init_gyro(void) {
  fd = wiringPiI2CSetup(MPU6050_I2C_ADDRESS);
  if (fd == -1)
    return;

  wiringPiI2CReadReg8(fd, MPU6050_PWR_MGMT_1);
  wiringPiI2CWriteReg16(fd, MPU6050_PWR_MGMT_1, 0);
}

int8_t get_gyro_x(void) {
  return (int8_t) wiringPiI2CReadReg8(fd, MPU6050_GYRO_XOUT_H);
}

int8_t get_gyro_y(void) {
  return (int8_t) wiringPiI2CReadReg8(fd, MPU6050_GYRO_YOUT_H);
}

static int8_t get_accel_x(void) {
  return (int8_t) wiringPiI2CReadReg8(fd, MPU6050_ACCEL_XOUT_H);
}

static int8_t get_accel_y(void) {
  return (int8_t) wiringPiI2CReadReg8(fd, MPU6050_ACCEL_YOUT_H);
}

static int8_t get_accel_z(void) {
  return (int8_t) wiringPiI2CReadReg8(fd, MPU6050_ACCEL_ZOUT_H);
}

double get_angle_x(void) {
  int x = get_accel_x();
  int y = get_accel_y();
  int z = get_accel_z();
  double ax = atan(x / (sqrt(y * y + z * z))) * 180 / M_PI;
  return ax;
}

double get_angle_y(void) {
  int x = get_accel_x();
  int y = get_accel_y();
  int z = get_accel_z();
  double ay = atan(y / (sqrt(x * x + z * z))) * 180 / M_PI;
  return ay;
}




